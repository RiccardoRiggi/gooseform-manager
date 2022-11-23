
import axios from "axios";
export default axios.create({
    baseURL:"http://localhost:8080/gooseform/manager",
    headers: {
        "Content-type": "application/json",
    }
});

