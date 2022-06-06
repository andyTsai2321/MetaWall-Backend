function handleSuccess(res, data = []) {
  res.send({
    status: true,
    data: data,
  });
}
module.exports = handleSuccess;
