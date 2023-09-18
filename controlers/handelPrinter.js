
import { Printer } from "../models/printer.js";

export const addPrinter = (req, res, next) => {

  
 
  // const room = req.body.room;
  // const address = req.body.address;
  // const pag = req.body.pag;
  // const printerModel = req.body.printerModel;
  // const line = req.body.line;
  // const department = req.body.department;
  // const description = req.body.description;

  const newPrinter = new Printer(req.body);
  console.log(newPrinter);
  //  const {address, printerModel,line,pag,description,department,room } = JSON.stringify(req.body)
  //   const printer = new Printer({address, pag, printerModel, line, department, description, room});

    // const printer = new Printer({pag, room, printerModel, line, department, description,address});
    
    

 
    newPrinter.save()
    .then(res.send())
    .catch((err) => {
      console.log(err);
    });
  
 
 // res.send();
}

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
  const printer = {...req.body}
  delete printer._id
  console.log("printers:", printer)
  try {
    const updetedPrinter = await Printer.findByIdAndUpdate(_id, {...printer})
   
    res.status(200).json("The Printer has been updated");
  } catch (error) {
    next(error);
  }
};

