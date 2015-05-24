/// <reference path="../../typings/web.rx.d.ts" />

class ViewModel {
    public firstName = wx.property(wx.router.current().params.firstName || 'Homer');
    public lastName = wx.property(wx.router.current().params.lastName || 'Simpson');

    public fullName = wx.whenAny(this.firstName, this.lastName, (firstName, lastName) => {
        // save state
        wx.router.updateCurrentStateParams(params=> {
            params.firstName = firstName;
            params.lastName = lastName;
        })

        return firstName + " " + lastName;
    }).toProperty();
}

export = ViewModel;
