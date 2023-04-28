import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Schema, schema } from "src/utils/rules";

import useQueryConfig from "./useQueryConfig";
import { yupResolver } from "@hookform/resolvers/yup";
import { createSearchParams, useNavigate } from "react-router-dom";
import omit from "lodash/omit";
import path from "src/constants/path";

type FormData = Pick<Schema, "name">;
const nameSchema = schema.pick(["name"]);

export default function useSearchProduct() {
  const queryConfig = useQueryConfig();
  const navigate = useNavigate();

  const { register, handleSubmit, setValue } = useForm<FormData>({
    defaultValues: {
      // name: queryConfig.name || ''
      name: queryConfig.name,
    },
    resolver: yupResolver(nameSchema),
  });

  useEffect(() => {
    setValue("name", queryConfig.name || "");
  }, [queryConfig.name, setValue]);

  const onSubmitSearch = handleSubmit((data) => {
    const config = queryConfig.order
      ? omit(
          {
            ...queryConfig,
            name: data.name,
          },
          ["order", "sort_by"]
        )
      : {
          ...queryConfig,
          name: data.name,
        };
    navigate({
      pathname: path.home,
      search: createSearchParams(config).toString(),
    });
  });

  return { register, onSubmitSearch };
}
