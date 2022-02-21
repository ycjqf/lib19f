import { LoaderFunction, MetaFunction, useLoaderData } from "remix";
import { ApiGetProfileRequest, ApiGetProfileResponse } from "~typings/api";

export let loader: LoaderFunction = async ({ params }) => {
  const result = await fetch("http://localhost:1337/api/get/profile", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: params.name || "",
    } as ApiGetProfileRequest),
  });
  const data = (await result.json()) as ApiGetProfileResponse;
  // if (data.code === "NO_SUCH_USER") throw new Response("Not Found", { status: 404 });
  return result;
};

export const meta: MetaFunction = ({ data }) => {
  const result = data as ApiGetProfileResponse;
  return {
    title: `${result.profile?.name} ${result.profile?.name}`,
  };
};

export default function Update() {
  const result = useLoaderData() as ApiGetProfileResponse;
  return (
    <div>
      <h1>User {`${result}`}</h1>
    </div>
  );
}
