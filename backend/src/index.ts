import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const Port = 4000;

app.listen(Port, () => {
  console.log(`Server is running on Port: ${Port}`);
});
