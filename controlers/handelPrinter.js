import { Printer } from "../models/printer.js";


export function addPrinter(req, res, next)  {
  const room = req.body.room;
  const address = req.body.address;
  const pag = req.body.pag;
  const printerModel = req.body.printerModel;
  const line = req.body.line;
  const department = req.body.department;
  const description = req.body.description;
  

   
     const newPrinter = new Printer(req.body)
    // console.log(newPrinter)
  //   const {address, printerModel,line,pag,description,department,room } = JSON.stringify(req.body)
  //   // const printer = new Printer({address, pag, printerModel, line, department, description, room});


  //  const printer = new Printer({pag, room, printerModel, line, department, description,address});

  
    newPrinter
      .save()
      .then(res.send(req))
      .catch((err) => {
        console.log(err);
      });
    res.send()
  };

