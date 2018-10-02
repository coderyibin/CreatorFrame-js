//
//  PayPalCtrl.h
//  VitalityMainland-mobile
//
//  Created by linyibin on 2018/9/11.
//

#import <UIKit/UIKit.h>
#import "../PayPal/PayPalMobile.h"
#import "../PayPal/PayPalConfiguration.h"
#import "../PayPal/PayPalMobile.h"
#import "../PayPal/PayPalFuturePaymentViewController.h"
#import "../PayPal/PayPalProfileSharingViewController.h"

@interface PayPalCtrl : NSObject <PayPalPaymentDelegate, PayPalFuturePaymentDelegate, PayPalProfileSharingDelegate>

    +(instancetype) getInstance ;
    + (void) pay;
-(id)initPaypal : (UIViewController*)view;
//- (void) InitPayConfig : UIView * _view;
@property (nonatomic, retain) UIViewController * _viewctrl;
@property(nonatomic, strong, readwrite) NSString *environment;
@property(nonatomic, strong, readwrite) NSString *resultText;
@end
