import Link from 'next/link';

const LandingPage = ({ currentUser, games }) => {
  const ticketList = games.map((game) => {
    return (
      <tr key={game.id}>
        <td>{game.title}</td>
        <td>{game.price}</td>
        <td>
          <Link href="/games/[ticketId]" as={`/games/${game.id}`}>
            <a>View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h2>Games</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/games');

  return { games: data };
};

export default LandingPage;
