sap.ui.define(
    [
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel"

    ],
    function(BaseController,JSONModel) {
      "use strict";
  
      return BaseController.extend("project1.controller.App", {
        onInit() {
          let oViewModel = new JSONModel({
            layout: "OneColumn" //layout: "TwoColumnsMidExpanded"
          }); 
          this.getOwnerComponent().setModel(oViewModel, "appView");
                  
        }
      });
    }
  );
  