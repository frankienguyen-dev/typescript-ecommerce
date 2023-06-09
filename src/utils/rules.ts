import { RegisterOptions, UseFormGetValues } from "react-hook-form";
import * as yup from "yup";

type Rules = {
  [key in "email" | "password" | "password_confirm"]?: RegisterOptions;
};

export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
  email: {
    required: {
      value: true,
      message: "Vui lòng nhập email",
    },
    pattern: {
      value: /^\S+@\S+\.\S+$/,
      message: "Email không đúng định dạng",
    },
    maxLength: {
      value: 160,
      message: "Độ dài email từ 5 đến 160 ký tự",
    },
    minLength: {
      value: 5,
      message: "Độ dài email từ 5 đến 160 ký tự",
    },
  },

  password: {
    required: {
      value: true,
      message: "Vui lòng nhập password",
    },
    maxLength: {
      value: 160,
      message: "Độ dài password từ 6 đến 160 ký tự",
    },
    minLength: {
      value: 6,
      message: "Độ dài password từ 6 đến 160 ký tự",
    },
  },
  password_confirm: {
    required: {
      value: true,
      message: "Vui lòng nhập lại password",
    },
    maxLength: {
      value: 160,
      message: "Độ dài password từ 6 đến 160 ký tự",
    },
    minLength: {
      value: 6,
      message: "Độ dài password từ 6 đến 160 ký tự",
    },
    validate:
      typeof getValues === "function"
        ? (value) =>
            value === getValues("password") || "Password không trùng khớp"
        : undefined,
  },
});

function testPriceMinMax(this: yup.TestContext<yup.AnyObject>) {
  const { price_max, price_min } = this.parent as {
    price_min: string;
    price_max: string;
  };
  if (price_min !== "" && price_max !== "") {
    return Number(price_max) >= Number(price_min);
  }
  return price_min !== "" || price_max !== "";
}

const handleConfirmPasswordYup = (refString: string) => {
  return yup
    .string()
    .required("Vui lòng nhập lại password")
    .max(150, "Độ dài email từ 5 đến 160 ký tự")
    .min(5, "Độ dài email từ 5 đến 160 ký tự")
    .oneOf([yup.ref(refString)], "Password không trùng khớp");
};

export const schema = yup.object({
  email: yup
    .string()
    .required("Vui lòng nhập email")
    .email("Email không đúng định dạng")
    .max(150, "Độ dài email từ 5 đến 160 ký tự")
    .min(5, "Độ dài email từ 5 đến 160 ký tự"),
  password: yup
    .string()
    .required("Vui lòng nhập password")
    .max(160, "Độ dài password từ 6 đến 160 ký tự")
    .min(6, "Độ dài password từ 6 đến 160 ký tự"),
  password_confirm: handleConfirmPasswordYup("password"),
  price_min: yup.string().test({
    name: "price-not-allowed",
    message: "Giá không phù hợp",
    test: testPriceMinMax,
  }),
  price_max: yup.string().test({
    name: "price-not-allowed",
    message: "Giá không phù hợp",
    test: testPriceMinMax,
  }),
  name: yup.string().required("Nhập tên sản phẩm là bắt buộc").trim(),
});

export const userSchema = yup.object({
  name: yup.string().max(160, "Độ dài tối đa là 160 kí tự"),
  phone: yup.string().max(20, "Độ dài tối đa 20 ký tự"),
  address: yup.string().max(160, "Độ dài tối đa là 160 kí tự"),
  avatar: yup.string().max(1000, "Độ dài tối đa là 1000 kí tự"),
  date_of_birth: yup.date().max(new Date(), "Hãy chọn 1 ngày trong quá khứ"),
  password: schema.fields["password"] as yup.StringSchema<string | undefined>,
  new_password: schema.fields["password"] as yup.StringSchema<
    string | undefined
  >,
  password_confirm: handleConfirmPasswordYup("password_confirm"),
});

export type UserSchema = yup.InferType<typeof userSchema>;

export type Schema = yup.InferType<typeof schema>;
