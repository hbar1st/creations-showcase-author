import { useLoaderData } from "react-router";

import "../styles/Author.css";

export default function Author() {
  
  const { userProfile } = useLoaderData();
  console.log("here's the data in the associated component: ", userProfile)
  return (
    <main>
      <h1>This is the author dashboard?</h1>
      <article>
        <p>Welcome, {userProfile.firstname}</p>
      </article>
      <section>

      </section>
    </main>
  );
}

/*
{
    "email": "hbar1stdev@gmail.com",
    "firstname": "Hana",
    "lastname": "Banana",
    "nickname": "Johnny"
}
    */