import Amplify, { API, graphqlOperation } from 'aws-amplify'

import awsconfig from './aws-exports'
import { createTodo } from './graphql/mutations'
import { listTodos } from './graphql/queries'
import { onCreateTodo } from './graphql/subscriptions'

Amplify.configure(awsconfig);

const createNewTodo = async () => {
    const todo = {
        name: 'Use AppSync',
        description: `Realtime and Offline (${new Date().toLocaleString()})`,
    }

    return await API.graphql(graphqlOperation(createTodo, { input: todo }))
};

const getData = async () => {
    API.graphql(graphqlOperation(listTodos))
        .then((e) => {
            e.data.listTodos.items.map((todo, i) => {
                QueryResult.innerHTML += `<p>${todo.name} - ${todo.description}</p>`
            })
        })
}

const MutationButton = document.getElementById('MutationEventButton');
const MutationResult = document.getElementById('MutationResult');
const QueryResult = document.getElementById('QueryResult');
const SubscriptResult = document.getElementById('SubscriptionResult');

MutationButton.addEventListener('click', (e) => {
    createNewTodo()
        .then((e) => {
            MutationResult.innerHTML += 
            `<p>${e.data.createTodo.name} - ${e.data.createTodo.description}</p>`
        });
});

API.graphql(graphqlOperation(onCreateTodo))
    .subscribe({
        next: (e) => {
            const todo = e.value.data.onCreateTodo;
            SubscriptResult.innerHTML += `<p>${todo.name} - ${todo.description}</p>`
        }
    })

getData()