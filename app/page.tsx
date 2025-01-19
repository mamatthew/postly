import Search from "./components/Search";

export default function Home() {
  return (
    <div>
      <h1>Welcome to Postly!</h1>
      <p>
        Browse and find the things you are looking for. Postly is a platform for
        you to find the things you need.
      </p>
      <Search />
    </div>
  );
}
