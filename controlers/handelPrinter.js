import { Printer } from "../models/printer.js";

export const addPrinter = (req, res, next) => {
  const newPrinter = new Printer(req.body);
  console.log(newPrinter);

  newPrinter
    .save()
    .then(res.send())
    .catch((err) => {
      console.log(err);
    });

  // res.send();
};

export const deletePrinter = async (req, res, next) => {
  try {
    await Printer.findByIdAndDelete(req.params._id);
    res.status(200).json("The Printer has been removed");
  } catch (error) {
    next(error);
  }
};

export const updatePrinter = async (req, res, next) => {
  const _id = req.body._id;
  const printer = { ...req.body };
  delete printer._id;
  console.log("printers:", printer);
  try {
    const updetedPrinter = await Printer.findByIdAndUpdate(_id, { ...printer });

    res.status(200).json("The Printer has been updated");
  } catch (error) {
    next(error);
  }
};
