package main

//data := [][]string{
//	{"PurchaseOrderID", typeInt, "", noDBPrefix, "", "", sFalse, sFalse},
//	{"ProductID", typeInt, "", noDBPrefix, "", "", sFalse, sFalse},
//	{"ProductName", typeString, "", dbPrefix, "", "", sFalse, sFalse},
//	{"FeaturedImage", typeString, "", noDBPrefix, "", "", sFalse, sFalse},
//	{"ProductCategoryID", typePtrInt, "", noDBPrefix, "", "", sFalse, sFalse},
//	{"ProductCategoryName", typePtrString, "", noDBPrefix, "", "", sFalse, sFalse},
//	{"Quantity", typeInt, "", noDBPrefix, "", "", sFalse, sFalse},
//	{"UnitPrice", typeInt, "", noDBPrefix, "", "", sFalse, sFalse},
//}
//data := [][]string{
//	{"CartID", typeInt, "", noDBPrefix, "", ""},
//	{"ProductID", typeInt, "", noDBPrefix, "", ""},
//	{"ProductName", typeString, "", noDBPrefix, "", ""},
//	{"ProductCategoryID", typeInt, "", noDBPrefix, "", ""},
//	{"ProductCategoryName", typeString, "", noDBPrefix, "", ""},
//	{"FeaturedImage", typeString, "", noDBPrefix, "", ""},
//	{"UnitPrice", typeInt, "", noDBPrefix, "", ""},
//	{"WishQuantity", typeInt, "", noDBPrefix, "", ""},
//	{"MaxOrderQuantity", typeInt, "", noDBPrefix, "", ""},
//}
//data := [][]string{
//	{"PurchaseOrderID", typeInt, "", noDBPrefix, "", ""},
//	{"Etag", typeInt, "", noDBPrefix, "", ""},
//
//	{"GrossPaymentPriceMicros", typeInt, "", noDBPrefix, "", ""},
//
//	{"TransferredPriceMicros", typeInt, "", noDBPrefix, "", ""},
//	{"CommissionPriceMicros", typeInt, "", noDBPrefix, "", ""},
//	{"ShippingFeeMicros", typeInt, "", noDBPrefix, "", ""},
//	{"PaymentFeeMicros", typeInt, "", noDBPrefix, "", ""},
//}
//data := [][]string{
//	{"PurchaseOrderID", typeInt, "", noDBPrefix, "", "purchase_order_id"},
//	{"ShopID", typeInt, "", noDBPrefix, "", "shop_id"},
//	{"ProductSKUID", typeInt, "", noDBPrefix, "", "product_sku_id"},
//	{"ProductID", typeInt, "", noDBPrefix, "", "product_id"},
//	{"ProductName", typeString, "", noDBPrefix, "", "product_name"},
//	{"ProductFeaturedImage", typeString, "", noDBPrefix, "", "product_featured_image"},
//	{"ProductFirstOptionID", typeInt, "", noDBPrefix, "", "product_first_option_id"},
//	{"ProductFirstOptionName", typeString, "", noDBPrefix, "", "product_first_option_name"},
//	{"ProductFirstOptionChoiceID", typeInt, "", noDBPrefix, "", "product_first_option_choice_id"},
//	{"ProductFirstOptionChoiceValue", typeString, "", noDBPrefix, "", "product_first_option_choice_value"},
//	{"ProductSecondOptionID", typeInt, "", noDBPrefix, "", "product_second_option_id"},
//	{"ProductSecondOptionName", typeString, "", noDBPrefix, "", "product_second_option_name"},
//	{"ProductSecondOptionChoiceID", typeInt, "", noDBPrefix, "", "product_second_option_choice_id"},
//	{"ProductSecondOptionChoiceValue", typeString, "", noDBPrefix, "", "product_second_option_choice_value"},
//	{"Quantity", typeInt, "", noDBPrefix, "", "quantity"},
//	{"UnitPriceMicros", typeInt, "", noDBPrefix, "", "unit_price_1000000x"},
//	{"TotalPriceMicros", typeInt, "", noDBPrefix, "", "total_price_1000000x"},
//	{"AddOnDiscountEventID", typeInt, "", noDBPrefix, "", "add_on_discount_event_id"},
//	{"AddOnGiftEventID", typeInt, "", noDBPrefix, "", "add_on_gift_event_id"},
//	{"BundleEventID", typeInt, "", noDBPrefix, "", "bundle_event_id"},
//	{"DiscountEventID", typeInt, "", noDBPrefix, "", "discount_event_id"},
//}
//data := [][]string{
//	{"ShopID", typeInt, "", noDBPrefix, camelStyle("shopID"), "shop_id"},
//	{"CartID", typeInt, "", noDBPrefix, camelStyle("CartID"), "cart_id"},
//	{"CustomerID", typeInt, "", noDBPrefix, camelStyle("CustomerID"), "customer_id"},
//	{"PaymentRecordID", typeInt, "", noDBPrefix, camelStyle("PaymentRecordID"), "payment_record_id"},
//
//	{"TotalCompareAtPriceMicros", typeInt, "", noDBPrefix, camelStyle("TotalCompareAtPriceMicros"), "total_compare_at_price_1000000x"},
//	{"TotalProductPriceMicros", typeInt, "", noDBPrefix, camelStyle("TotalProductPriceMicros"), "total_product_price_1000000x"},
//	{"TotalDiscountPriceMicros", typeInt, "", noDBPrefix, camelStyle("TotalDiscountPriceMicros"), "total_discount_price_1000000x"},
//	{"TotalBundleSavedPriceMicros", typeInt, "", noDBPrefix, camelStyle("TotalBundleSavedPriceMicros"), "total_bundle_saved_price_1000000x"},
//
//	{"TotalShippingFeeMicros", typeInt, "", noDBPrefix, camelStyle("TotalShippingFeeMicros"), "total_shipping_fee_1000000x"},
//	{"TotalSavedShippingFeeMicros", typeInt, "", noDBPrefix, camelStyle("TotalSavedShippingFeeMicros"), "total_saved_shipping_fee_1000000x"},
//	{"TotalPriceWithFeesMicros", typeInt, "", noDBPrefix, camelStyle("TotalPriceWithFeesMicros"), "total_price_with_fees_1000000x"},
//	{"TotalPaymentPriceMicros", typeInt, "", noDBPrefix, camelStyle("TotalPaymentPriceMicros"), "total_payment_price_1000000x"},
//
//	{"TotalCouponSavedPriceMicros", typeInt, "", noDBPrefix, camelStyle("TotalCouponSavedPriceMicros"), "total_coupon_saved_price_1000000x"},
//}
//data := [][]string{
//	{"AddOnEventID", typeInt, "", noDBPrefix, "addOnEventId", "add_on_event_id"},
//	{"ShopID", typeTime, "", noDBPrefix, "shopId", "shop_id"},
//	{"AddOnEventProductType", typeString, "", noDBPrefix, "addOnEventProductType", "add_on_event_product_type"},
//	{"ProductID", typeInt, "", noDBPrefix, "productId", "product_id"},
//	{"ProductSKUID", typeInt, "", noDBPrefix, "productSKUId", "product_sku_id"},
//	{"IsEffective", typeBool, "", noDBPrefix, "isEffective", "is_effective"},
//	{"EventPriceMicros", typeInt, "", noDBPrefix, "eventPriceMicros", "event_price_1000000x"},
//	{"MaxQuantity", typeInt, "", noDBPrefix, "maxQuantity", "max_quantity"},
//}
