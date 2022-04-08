const { transaction, product, user } = require("../../models");

exports.addTransaction = async (req, res) => {
  try {
    await transaction.create(req.body);

    res.send({
      status: "success",
      message: "Add transaction finished",
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server error",
    });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const data = await transaction.findAll({
      attributes: {
        exclude: ["createdAt", "updatedAt", "status", "idProduct", "idBuyer", "idSeller"],
      },
      include: [
        {
          model: product,
          as: "product",
          attributes: {
            exclude: ["createdAt", "updatedAt", "idUser", "qty", "price"],
          },
        },
        {
          model: user,
          as: "buyer",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password", "status"],
          },
        },
        {
          model: user,
          as: "seller",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password", "status"],
          },
        },
      ],
    });

    res.send({
      status: "success",
      data,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server error",
    });
  }
};
