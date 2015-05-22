/// <reference path="../../typings/web.rx.d.ts" />

class ViewModel {
    public firstName = wx.property('Bart');
    public lastName = wx.property('Simpson');
    
    public fullName = wx.whenAny(this.firstName, this.lastName, function(firstName, lastName) { 
      return firstName + " " + lastName; }).toProperty();
}

export = ViewModel;
