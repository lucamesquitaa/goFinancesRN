import React ,{ useState , useEffect} from "react";
import { Button } from "../../components/Form/Button";
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import * as Yup from 'yup';
import {yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useNavigation } from "@react-navigation/native";
import { InputForm } from "../../components/Form/InputForm";
import { TransactionTypeButton } from "../../components/Form/TransactionTypeButton";
import { CategorySelectButton } from "../../components/Form/CategorySelectButton";
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { 
    Modal, 
    Keyboard,
    Alert
} from "react-native"; 
import {CategorySelect} from '../CategorySelect';

import {
    Container,
    Header,
    Title,
    Form,
    Fields,
    TransactionTypes
} from './styles';


interface FormData{
    name: string,
    amount: string
}

const schema = Yup.object().shape({
    name: Yup.string().required("Nome é obrigatório"),
    amount: Yup.number()
    .typeError("Informe um valor numérico")
    .positive("O valor não pode ser negativo")
    .required("O valor é obrigatório")
});

type NavigationProps = {
    navigate:(screen:string) => void;
 }

export function Register(){
    
    const [transactionType, setTransactionType] = useState('');
    const [categoryModalOpen, setCategoryModalOpen] = useState(false);

    

    const [category, setCategory] = useState({
        key: 'category',
        name: 'Categoria'
    });

    const navigation = useNavigation<NavigationProps>();

    const {
        control,
        handleSubmit,
        reset,
        formState: {errors}
    } = useForm({
        resolver: yupResolver(schema)
    });

    function handleTransactionTypeSelect(type: 'up' | 'down'){
        setTransactionType(type);
    }

    function handleOpenSelectCategoryModal(){
        setCategoryModalOpen(true);
    }
    function handleCloseSelectCategoryModal(){
        setCategoryModalOpen(false);
    }
    
    async function handleRegister(form: FormData){

        

        if(!transactionType)
            return Alert.alert("Selecione o tipo da transação");
        if(category.key === 'category')
            return Alert.alert("Selecione a categoria");



        const newTransaction={
            id: String(uuid.v4()),
            name: form.name,
            amount: form.amount,
            transactionType,
            category: category.key,
            date: String(new Date())
        }

        try {
            const dataKey = '@gofinances:transactions';
            const data = await AsyncStorage.getItem(dataKey);
            const currentData = data ? JSON.parse(data) : [];

            const dataFormatted = [
                ...currentData,
                newTransaction
            ]

            await AsyncStorage.setItem(dataKey, JSON.stringify(dataFormatted));
        
            reset();
            setTransactionType('');
            setCategory({
                key: 'category',
                name: 'Categoria'
            });

            navigation.navigate('Listagem');

        } catch (error) {
            console.log(error);
            Alert.alert("Não foi possível salvar");
        }
    }


     useEffect(() => {
     async function deleteAll() {
       const dataKey = '@gofinances:transactions';

       await AsyncStorage.removeItem(dataKey);
     }
     deleteAll();
   }, []);

    return(
        <TouchableWithoutFeedback 
        onPress={Keyboard.dismiss} 
        containerStyle={{flex: 1}}
        style={{flex: 1}}
        >
        <Container>
        
            <Header>
                <Title>Cadastro</Title>
            </Header>
            <Form>
                <Fields>
                    <InputForm
                    placeholder="Nome"
                    name="name"
                    control={control}
                    autoCapitalize="sentences"
                    autoCorrect={false}
                    error={errors.name && errors.name.message}
                    />
                    <InputForm
                    name="amount"
                    placeholder="Preço"
                    control={control}
                    keyboardType="numeric"
                    error={errors.amount && errors.amount.message}
                    />
                    <TransactionTypes>
                        <TransactionTypeButton
                            type="up"
                            title="Income"
                            onPress={() => handleTransactionTypeSelect('up')}
                            isActive={transactionType === 'up'}
                        />
                        <TransactionTypeButton
                            type="down"
                            title="Outcome"
                            onPress={() => handleTransactionTypeSelect('down')}
                            isActive={transactionType === 'down'}
                        />
                    </TransactionTypes>

                    <CategorySelectButton 
                    title={category.name}
                    onPress={handleOpenSelectCategoryModal}
                    />
                    
                </Fields>
                <Button 
                onPress={handleSubmit(handleRegister)}
                title="Enviar"/>
            </Form>
            
            <Modal visible={categoryModalOpen}>
                <CategorySelect
                    category={category}
                    setCategory={setCategory}
                    closeSelectCategory={handleCloseSelectCategoryModal}
                />
            </Modal>
       
        </Container>
        </TouchableWithoutFeedback>
    )
}