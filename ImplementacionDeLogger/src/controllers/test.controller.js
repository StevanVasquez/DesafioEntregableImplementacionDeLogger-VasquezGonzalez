export const testLogger = (req, res) => {
    try {
      req.logger.fatal(
        `Fatal level - ${req.method} en ${
          req.url
        } - ${new Date().toLocaleTimeString()}`
      );
      req.logger.error(
        `Error level - ${req.method} en ${
          req.url
        } - ${new Date().toLocaleTimeString()}`
      );
      req.logger.warning("Warn level");
      req.logger.info("Info level");
      req.logger.http("Http level");
      req.logger.debug("Debug level");
    } catch (err) {
      req.logger.error(`Error in GET - ${err.message}`);
    } finally {
      res.send({ message: "Logger levels test." });
    }
  };