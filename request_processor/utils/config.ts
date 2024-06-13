import { config } from "dotenv";
import YAML from "yaml";
import * as Bun from "bun";

config({});

export function getEnvVariables() {
  const requiredEnvVars = {
    PACKAGE_ADDRESS: process.env.PACKAGE_ADDRESS,
    ADMIN_SECRET_KEY: process.env.ADMIN_SECRET_KEY,
    ADMIN_CAP: process.env.ADMIN_CAP,
    ADMIN_ADDRESS: process.env.ADMIN_ADDRESS,
  };

  const missingEnvVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => value === undefined || value === "")
    .map(([key]) => key);

  if (missingEnvVars.length > 0) {
    throw new Error(
      `The following required environment variables are missing: ${missingEnvVars.join(", ")}`,
    );
  }

  return requiredEnvVars;
}

export type SmartContractSetup = {
  name: string;
  functions: [SmartContractFunction];
};

type SmartContractFunction = {
  name: string;
  arguments: SmartContractFunctionArgument[];
};

type SmartContractFunctionArgument = {
  type: string;
};

/*
Reads the smart contract configuration file and returns the parsed object.
The configuration file is expected to be in the root directory of the project and named `smart_contract_config.yaml`.
It contains information about the smart contract functions that are going to be called through
the sui typescript sdk. This enables our service to know which functions are available to be called through the handler's API
and what arguments they expect.
*/
export async function getSmartContractFunctionsConfig(): Promise<SmartContractSetup> {
  const yaml_contents: string = await Bun.file(
    "smart_contract_config.yaml",
  ).text();
  const contractSetup = YAML.parse(yaml_contents) as SmartContractSetup;
  return contractSetup;
}
