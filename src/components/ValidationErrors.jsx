import "../styles/App.css";

export default function ValidationErrors({details}) {
  return (
    <>
      <header>
        <h1>Failed to complete sign-up.</h1>
      </header>
      <ul>{console.log("in ValidationErrors: ", details)}</ul>
    </>
  );
}