import foo from "./demo.json";

if (process.env.NODE_ENV === "production") {
    console.log("production");
}

if (process.env.NODE_ENV === "development") {
    console.log("development");
}

if (!process.env.NODE_ENV) {
    console.log(foo);
}