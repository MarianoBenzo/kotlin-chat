import Axios from "axios";

const axiosInstance = Axios.create({
  timeout: 60000
});

export default axiosInstance;
