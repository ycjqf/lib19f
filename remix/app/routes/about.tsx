import { LIBRARY_NAME, LIBRARY_SLOGAN } from "~typings/constants";

export default function About() {
  return (
    <div className="my-10 mx-auto w-96">
      <h3 className="text-5xl mb-4">{LIBRARY_NAME}</h3>
      <p className="text-base">{LIBRARY_SLOGAN}</p>
    </div>
  );
}
