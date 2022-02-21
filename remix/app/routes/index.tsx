import { Container, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { HeadersFunction, LoaderFunction, useLoaderData } from "remix";
import HeaderBar from "~/components/HeaderBar";
import InboxIcon from "@mui/icons-material/Inbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import { LIBRARY_NAME, LIBRARY_SLOGAN } from "~typings/constants";

export let loader: LoaderFunction = async ({ request }) => {
  const authResult = await fetch("http://localhost:1337/api/authenticate", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      cookie: `${request.headers.get("cookie")}`,
    },
    body: "{}",
  });
  const authData = await authResult.json();
  console.log(authData);
  if (authData.isLogged) {
    const result = await fetch("http://localhost:1337/api/get/profile", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        cookie: `${request.headers.get("cookie")}`,
      },
      body: JSON.stringify({
        id: authData.id,
      }),
    });
    return result;
  } else {
    console.log("not logged");
    return null;
  }
};

export default function Index() {
  const data = useLoaderData();
  return (
    <div>
      <HeaderBar />
      <Container maxWidth="md">
        {/* <div className="flex flex-col items-start justify-center mt-8 mb-16">
          <h3 className="text-xl font-bold">{LIBRARY_NAME}</h3>
          <p className="text-base">{LIBRARY_SLOGAN}</p>
        </div> */}
      </Container>
      <Container maxWidth="md" className="bg-black min-h-[100px]"></Container>
    </div>
  );
}
