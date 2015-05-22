/// <reference path="../../typings/web.rx.d.ts" />

class ViewModel {
    public items = wx.list(["Alpha", "Beta", "Gamma"]);
    public itemToAdd = wx.property("");
    public selectedItem = wx.property(null);

    public addItemCmd = wx.command(function () {
        if (this.itemToAdd() != "") {
            // add the item
            this.items.add(this.itemToAdd());

            // clear the textbox
            this.itemToAdd("");
        }
    }, wx.whenAny(this.itemToAdd, function (itemToAdd) {
        return itemToAdd.length > 0
    }), this);
    
    public removeItemCmd = wx.command(function () {
        // remove the item
        this.items.remove(this.selectedItem());

        // clear selection
        this.selectedItem(null);
    }, wx.whenAny(this.selectedItem, function (selectedItem) {
        return selectedItem != null;
    }), this);
}

export = ViewModel;
