import { LoaderFunction, useLoaderData } from "remix";

export const loader: LoaderFunction = async ({ params }) => {
  return params.id;
};

export default function Update() {
  const id = useLoaderData();
  return (
    <div>
      <h1>Update {id}</h1>
    </div>
  );
}
