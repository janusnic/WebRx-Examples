/// <reference path="../../typings/web.rx.d.ts" />

class ViewModel {
    public items = wx.list(["Alpha", "Beta", "Gamma"]);
    public itemToAdd = wx.property("");
    public selectedItem = wx.property(null);

    public addItemCmd = wx.command(() => {
        if (this.itemToAdd() != "") {
            // add the item
            this.items.add(this.itemToAdd());

            // clear the textbox
            this.itemToAdd("");
        }
    }, wx.whenAny(this.itemToAdd, function(itemToAdd) {
        return itemToAdd.length > 0
    }), this);

    public removeItemCmd = wx.command(() => {
        // remove the item
        this.items.remove(this.selectedItem());

        // clear selection
        this.selectedItem(null);
    }, wx.whenAny(this.selectedItem, (selectedItem) => {
        return selectedItem != null;
    }), this);
}

export = ViewModel;
