"use client";

import React from "react";
import {
  Accordion,
  AccordionItem,
  Badge,
  Button,
  Image,
  Link,
  Progress,
  RadioGroup,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { AnimatePresence, LazyMotion, m, domAnimation } from "framer-motion";
import { CreditCard, Truck } from "lucide-react";

import ShippingForm from "@/components/core/common/shipping-form";
import OrderSummary from "@/components/core/common/order-summary";
import PaymentMethodRadio from "@/components/core/common/payment-method-radio";
import cartItems from "@/helpers/data/cart-items";
import { cn } from "@/utils/cn";

export default function CheckoutModule() {
  const [[page, direction], setPage] = React.useState([0, 0]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 20 : -20,
      opacity: 0,
    }),
  };

  const paginate = (newDirection: number) => {
    if (page + newDirection < 0 || page + newDirection > 2) return;

    setPage([page + newDirection, newDirection]);
  };

  const ctaLabel = React.useMemo(() => {
    switch (page) {
      case 0:
        return "Tiếp tục đến vận chuyển";
      case 1:
        return "Tiếp tục đến thanh toán";
      case 2:
        return "Đặt hàng";
      default:
        return "Tiếp tục đến vận chuyển";
    }
  }, [page]);

  const stepTitle = React.useMemo(() => {
    switch (page) {
      case 0:
        return "Xem lại đơn hàng của bạn";
      case 1:
        return "Thông tin giao hàng";
      case 2:
        return "Chọn phương thức thanh toán";
      default:
        return "Xem lại đơn hàng của bạn";
    }
  }, [page]);

  const stepsContent = React.useMemo(() => {
    const paymentRadioClasses = {
      wrapper: "group-data-[selected=true]:border-foreground",
      base: "data-[selected=true]:border-foreground",
      control: "bg-foreground",
    };

    switch (page) {
      case 0:
        return <OrderSummary hideTitle items={cartItems} />;
      case 1:
        return (
          <div className="mt-4 flex flex-col gap-6">
            <ShippingForm hideTitle variant="bordered" />
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Accordion
                keepContentMounted
                aria-label="Select or add payment method"
                defaultExpandedKeys={["select_existing_payment"]}
                itemClasses={{
                  title: "text-medium text-foreground-500",
                  indicator: "text-foreground",
                }}
                selectionMode="multiple"
                showDivider={false}
              >
                <AccordionItem
                  key="select_existing_payment"
                  title="Chọn phương thức thanh toán"
                >
                  <RadioGroup
                    aria-label="Chọn phương thức thanh toán"
                    classNames={{ wrapper: "gap-3" }}
                    defaultValue="4229"
                  >
                    <PaymentMethodRadio
                      isRecommended
                      classNames={paymentRadioClasses}
                      description="Chuyển khoản ngân hàng"
                      icon={<CreditCard height={30} width={30} />}
                      label="Thanh toán trước"
                      value="8888"
                    />
                    <PaymentMethodRadio
                      classNames={paymentRadioClasses}
                      description="Thanh toán khi nhận hàng"
                      icon={<Truck height={30} width={30} />}
                      label="Ship COD"
                      value="4229"
                    />
                    {/* <PaymentMethodRadio
                      classNames={paymentRadioClasses}
                      description="Select this option to pay with PayPal"
                      icon={<PayPalIcon height={30} width={30} />}
                      label="PayPal"
                      value="paypal"
                    /> */}
                  </RadioGroup>
                </AccordionItem>
                {/* <AccordionItem
                  key="add_new_payment"
                  title="Add a new payment method"
                >
                  <PaymentForm variant="bordered" />
                </AccordionItem> */}
              </Accordion>
            </div>
          </div>
        );
      default:
        return null;
    }
  }, [page]);

  return (
    <section className="container mx-auto flex items-start gap-8 px-4 py-20">
      {/* Left */}
      <div className="w-full flex-none py-4 lg:w-[44%]">
        <div className="flex justify-between px-2">
          <div>
            <Button
              className="-ml-2 text-default-700"
              isDisabled={page === 0}
              radius="full"
              variant="flat"
              onPress={() => paginate(-1)}
            >
              <Icon icon="solar:arrow-left-outline" width={20} />
              Trở lại
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <p>
              <span className="text-small font-semibold text-default-700">
                500.00 VNĐ
              </span>
              <span className="ml-1 text-small text-default-500">
                (3 sản phẩm)
              </span>
            </p>
            <Badge content="4" showOutline={false}>
              <Icon icon="solar:cart-check-outline" width={28} />
            </Badge>
          </div>
        </div>
        <div className="flex h-full flex-1 flex-col p-4">
          <AnimatePresence custom={direction} initial={false} mode="wait">
            <LazyMotion features={domAnimation}>
              <m.div
                key={page}
                animate="center"
                className="mt-8 flex flex-col gap-3"
                custom={direction}
                exit="exit"
                initial="enter"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                variants={variants}
                onSubmit={(e) => e.preventDefault()}
              >
                <h1 className="text-2xl font-medium">{stepTitle}</h1>
                {stepsContent}
                <Button
                  fullWidth
                  className="mt-8 bg-foreground text-background"
                  size="lg"
                  onPress={() => paginate(1)}
                >
                  {ctaLabel}
                </Button>
              </m.div>
            </LazyMotion>
          </AnimatePresence>

          <div className="mt-auto flex w-full justify-between gap-8 pb-8 pt-4">
            <div className="flex w-full flex-col items-start gap-2">
              <p className="text-small font-medium">Tổng hợp</p>
              <Progress
                classNames={{
                  indicator: "!bg-foreground",
                }}
                value={page >= 0 ? 100 : 0}
              />
            </div>
            <div className="flex w-full flex-col items-start gap-2">
              <p className="text-small font-medium">Giao hàng</p>
              <Progress
                classNames={{
                  indicator: "!bg-foreground",
                }}
                value={page >= 1 ? 100 : 0}
              />
            </div>
            <div className="flex w-full flex-col items-start gap-2">
              <p className="text-small font-medium">Thanh toán</p>
              <Progress
                classNames={{
                  indicator: "!bg-foreground",
                }}
                value={page >= 2 ? 100 : 0}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="relative hidden h-[800px] w-full overflow-hidden rounded-medium shadow-small lg:block">
        {/* Top Shadow */}
        <div className="absolute top-0 z-10 h-32 w-full rounded-medium bg-gradient-to-b from-black/80 to-transparent" />
        {/* Bottom Shadow */}
        <div className="absolute bottom-0 z-10 h-32 w-full rounded-medium bg-gradient-to-b from-transparent to-black/80" />

        {/* Content */}
        <div className="absolute top-10 z-10 flex w-full items-start justify-between px-10">
          <h2 className="text-2xl font-medium text-white/70 [text-shadow:_0_2px_10px_rgb(0_0_0_/_20%)]">
            Mẫu áo bán chạy nhất của StyleUp
          </h2>
          <div className="flex flex-col items-end gap-1">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon
                  key={i}
                  className={cn(i < 5 ? "text-yellow-400" : "text-white/80")}
                  icon="solar:star-bold"
                  width={16}
                />
              ))}
            </div>
            <Link
              className="text-white/60"
              href="#"
              size="sm"
              underline="always"
            >
              120 đánh giá
            </Link>
          </div>
        </div>
        <Image
          removeWrapper
          alt="Nike Adapt BB 2.0"
          className="absolute inset-0 z-0 h-full w-full rounded-none object-cover"
          height="100%"
          src="https://media-fmplus.cdn.vccloud.vn/uploads/products/2405ASUK0020601/ec52b393-7912-466b-ac44-2805e7f19693.jpg"
        />
        <div className="absolute inset-x-4 bottom-4 z-10 flex items-center justify-between rounded-medium bg-background/10 p-8 backdrop-blur-md backdrop-saturate-150 dark:bg-default-100/50">
          <div className="flex flex-col gap-1">
            <h2 className="left-10 z-10 text-2xl font-medium text-white/90">
              Áo thun...
            </h2>
            <p className="left-10 z-10 text-white/80">200.000 VNĐ</p>
          </div>
          <Button
            className="border-white/40 pl-3 text-white"
            variant="bordered"
          >
            Xem sản phẩm
          </Button>
        </div>
      </div>
    </section>
  );
}
