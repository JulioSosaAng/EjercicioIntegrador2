sap.ui.define([
        "sap/ui/core/mvc/Controller",
        "sap/ui/model/json/JSONModel",
        "sap/ui/model/Filter",
        "sap/ui/model/FilterOperator",
        'sap/ui/model/Sorter',

    ],
        /**
         * @param {typeof sap.ui.core.mvc.Controller} Controller
         */
        function (Controller, JSONModel, Filter, FilterOperator, Sorter) {

            "use strict";
    
            return Controller.extend("project1.controller.Main", {
                onInit: function () {
                    this.oRouter = this.getOwnerComponent().getRouter();
                    const url = sap.ui.require.toUrl("project1") + "/northwind/northwind.svc/";
                    this._model = new sap.ui.model.odata.v2.ODataModel(url, {
                        json : true,
                        headers: {
                            "DataServiceVersion": "2.0",
                            "Cache-Control": "no-cache, no-store",
                            "Pragma": "no-cache"
                        },
                        useBatch: false
                    });
    
                    this._model.read("/Products_by_Categories",{
                        async: true,
                        success: jQuery.proxy(this.success, this),
                        error: jQuery.proxy(this.error, this),
                    })
                },
                success: function(oData){
                    const oModel = new JSONModel(oData.results);
                    this.getView().setModel(oModel, "productModel");               
                },
                error: function (){
                    alert("error");
                },
                onSearch: function (oEvent) {
                    var aFilter = [],
                        sQuery = oEvent.getSource().getValue();
        
                    if (sQuery && sQuery.length > 0) {
                        var oFilter1 = new Filter("ProductName", FilterOperator.Contains, sQuery);
                        var oFilter2 = new Filter("CategoryName", FilterOperator.Contains, sQuery);

                        aFilter.push(new Filter({
                            filters: [oFilter1, oFilter2],
                            and: false
                        }))
                    }
        
                    this.getView().byId("productsTable").getBinding("items").filter(aFilter, "Application");
                },
                onListItemPress: function (oEvent) {
                    var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(1),
                    productPath = oEvent.getSource().getSelectedItem().getBindingContext("productModel").getPath(),
                    product = productPath.split("/").slice(-1).pop();
                    this.oRouter.navTo("detail", {layout: oNextUIState.layout, product: product});
                    
                    let oViewModel = new JSONModel({
                        layout: "TwoColumnsBeginExpanded"   
                      });
        
                      this.getOwnerComponent().setModel(oViewModel, "appView"); 

  
                },

                onSort: function (oEvent) {
                    this._bDescendingSort = !this._bDescendingSort;
                    var oView = this.getView(),
                        oTable = oView.byId("productsTable"),
                        oBinding = oTable.getBinding("items"),
                        oSorter = new Sorter("ProductName", this._bDescendingSort);
        
                    oBinding.sort(oSorter);
                }
    
            });
        });
