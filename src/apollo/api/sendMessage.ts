import {gql} from 'graphql-tag';

const SEND_MESSAGE = gql`
    mutation sendMessage($message: String!, $to: String!, $chatId: String!) {
        sendMessage(message: $message, to: $to, chatId: $chatId) {
            id
            members
            messages {
                id
                date
                from
                message
            }
        }
    }
`;

export default SEND_MESSAGE;