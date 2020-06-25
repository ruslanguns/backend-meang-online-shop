import { IResolvers } from 'graphql-tools';
import StripeApi from '../../../lib/stripe-api';
import { IStripeCustomer } from '../../../interfaces/stripe/customer.interface';
const resolversStripeCustomerQuery: IResolvers = {
  Query: {
    async customers(_, { limit } ) {
        console.log(limit);
        const stripe = new StripeApi().stripe;
        return await stripe.customers.list(
            { limit }
        ).then((result: {has_more: boolean, data: Array<IStripeCustomer>}) => {
            return {
                status: true,
                message: 'Lista cargada correctamente con los clientes seleccionados',
                hasMore: result.has_more,
                customers: result.data
            };
        }).catch( (error: Error) => {
            return {
                status: false,
                message: 'Error: '.concat(error.message),
                hasMore: false,
            };
        });
    },
  },
};

export default resolversStripeCustomerQuery;