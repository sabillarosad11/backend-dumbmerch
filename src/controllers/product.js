const { product, user, transaction, category, categoryProduct } = require("../../models");

exports.addProduct = async (req, res) => {
  try {
    const data = req.body;

    data.image = req.file.filename;
    data.idUser = req.user.id;

    const newProduct = await product.create(data);
    let productData = await product.findOne({
      where: {
        id: newProduct.id,
      },
      include: [
        {
          model: user,
          as: 'user',
          attributes: {
            exclude: ['createdAt', 'updatedAt', 'password', 'image'],
          },
        },
        
      ],
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'idUser'],
      },
    });

    res.send({
      status: 'success',
      productData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 'failed',
      message: 'Server Error',
    });
  }
};


exports.getProducts = async (req, res) => {
  try {
    let products = await product.findAll({
      include: [
        {
          model: user,
          as: "user",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password"],
          },
        },

        {
          model: transaction,
          as: "transactions",
          attributes: {
            exclude: ["createdAt", "updatedAt", "status"],
          },
        },

        {
          model: category,
          as: "categories",
          through: {
            model: categoryProduct,
            as: "bridge",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "idUser"],
      },
    });

    const PATH = 'http://localhost:5003/uploads/';

    products = products.map((item) => {
      item.image = PATH + item.image;
      return item;
    });

    res.send({
      status: "success",
      data: {
          products,
      }
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server error",
    });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const data = await product.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["idUser", "createdAt", "updatedAt"],
      },
    });

    if (!data) {
      return res.send({
        error: {
          message: `Product with ID: ${id} not found `,
        },
      });
    }

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

exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id;

    await product.update(req.body, {
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      message: `Update product ID: ${id} finished`,
      data: req.body,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server error",
    });
  }
};


exports.deleteProduct= async (req, res) => {
  try {
    const id = req.params.id;

    await product.destroy({
      where: {
        id,
      },
    });

    res.send({
      status: "success",
      message: `Delete product by ID: ${id} finished`,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server error",
    });
  }
};