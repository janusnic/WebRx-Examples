/// <reference path="../../typings/web.rx.d.ts" />

class ViewModel {
    public firstName = wx.property('Hello');
    public lastName = wx.property('World');
    
    public fullName = wx.whenAny(this.firstName, this.lastName, function(firstName, lastName) { 
      return firstName + " " + lastName; }).toProperty();
}

export = ViewModel;
