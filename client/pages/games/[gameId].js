import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const TicketShow = ({ game }) => {
  const { doRequest, errors } = useRequest({
    url: '/api/orders',
    method: 'post',
    body: {
      ticketId: game.id,
    },
    onSuccess: (order) =>
      Router.push('/orders/[orderId]', `/orders/${order.id}`),
  });

  return (
    <div>
      <h1>{game.title}</h1>
      <h4>Price: {game.price}</h4>
      {errors}
      <button onClick={() => doRequest()} className="btn btn-primary">
        Purchase
      </button>
    </div>
  );
};

TicketShow.getInitialProps = async (context, client) => {
  const { ticketId } = context.query;
  const { data } = await client.get(`/api/games/${ticketId}`);

  return { game: data };
};

export default TicketShow;
