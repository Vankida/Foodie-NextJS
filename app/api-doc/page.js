import { getApiDoc } from "@/lib/swagger";
import ReactSwagger from "./react-swagger";
// import reactswa

export default async function IndexPage() {
  const spec = await getApiDoc();
  return (
    <div
      style={{
        position: "absolute",
        minWidth: "100vw",
        minHeight: "100vh",
        display: "flex",
        backgroundColor: "white",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          width: "100%",
        }}
      >
        {/* <pre>{JSON.stringify(spec, null, 2)}</pre> */}
        <ReactSwagger spec={spec} />
      </div>
    </div>
  );
}
