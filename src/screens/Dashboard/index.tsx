import React, { useEffect, useState } from "react";
import { Highlightcard } from "../../components/Highlightcard";
import { TransactionCard } from "../../components/TransactionCard";
import { TransactionCardProps } from "../../components/TransactionCard";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
    Container, 
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    Highlightcards,
    Transactions,
    Title,
    TransactionList,
    LogoutButton
} from './styles';


export interface DataListProps extends TransactionCardProps{
    id: string;
}

export function Dashboard(){
    const [data, setData] = useState<DataListProps[]>([]);

    async function loadTransactions(){
        const dataKey = '@gofinances:transactions';
        const response = AsyncStorage.getItem(dataKey);

        const transactions = response ? JSON.parse(response) : [];
        const transactionsFormatted: DataListProps[] = transactions
        .map((item : DataListProps) => {
            const amount = Number(item.amount)
            .toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            
            });
            
            
            const date = Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month:'2-digit',
                year: '2-digit'
            }).format(new Date(item.date));

            return{
                id: item.id,
                name: item.name,
                amount,
                type: item.type,
                category: item.category,
                date,
            }

        });


        setData(transactionsFormatted);
    }

    useEffect(() => {
        loadTransactions();

    } ,[]);

    return( 
        <Container>
            <Header> 
                <UserWrapper>
                    <UserInfo>
                        <Photo source={{uri:"https://github.com/lucamesquitaa.png"}}/>
                        <User>
                            <UserGreeting>Olá,</UserGreeting>
                            <UserName>Luca</UserName>
                        </User>
                    </UserInfo>
                    <LogoutButton onPress={() => {}}>
                        <Icon name="power"/>
                    </LogoutButton>
                </UserWrapper>
            </Header>
            <Highlightcards>
                <Highlightcard 
                type="up"
                title="Entradas" 
                amount="R$ 7.000,00" 
                lastTransaction="Ultima entrada dia 17/02"/>
                <Highlightcard 
                type="down"
                title="Saídas" 
                amount="R$ 800,00" 
                lastTransaction="Ultima saída dia 20/02"/>
                <Highlightcard 
                type="total"
                title="Entradas" 
                amount="R$ 6.200,00" 
                lastTransaction="01/03 a 07/03"/>
            </Highlightcards>

            <Transactions>
                <Title>Listagem</Title>
                <TransactionList
                    data={data}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => <TransactionCard data={item}/>}
                />
                
            </Transactions>

        </Container>
    )
}