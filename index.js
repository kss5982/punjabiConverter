import app from "./app.js";
import configuration from "./utils/config.js";
import logger from "./utils/logger.js";

app.listen(configuration.PORT, () => {
  logger.info(`Server running on port ${configuration.PORT}`);
});
