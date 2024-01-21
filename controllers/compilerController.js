const compiler = require("compilex");
var options = { stats: true };
compiler.init(options);

exports.Compiler = async (req, res) => {
  var code = req.body.code;
  var input = req.body.input;
  var lang = req.body.lang;
  if (lang === "C" || lang === "C++") {
    var envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } };
    compiler.compileCPPWithInput(envData, code, input, function (data) {
      if (data.error) {
        res.status(200).json({
          success: true,
          data: data,
        });
      } else {
        res.status(200).json({
          success: true,
          data: data,
        });
      }
    });
  }
  if (lang === "Python") {
    var envData = { OS: "windows" };
    compiler.compilePythonWithInput(envData, code, input, function (data) {
      if (data.error) {
        res.send(data.error);
      } else {
        res.send(data.output);
      }
    });
  }
};
