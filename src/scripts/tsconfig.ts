import * as fs from 'fs'
import * as path from 'path'
import ts from 'typescript'

export function findTSConfigPath(targetPath: string) {
  return ts.findConfigFile(targetPath, ts.sys.fileExists, 'tsconfig.json')
}

export function readTSConfig(targetPath: string) {
  const configFilePath = findTSConfigPath(targetPath)
  if (!configFilePath) return null

  const configJsonString = ts.readConfigFile(configFilePath, ts.sys.readFile)
  if (configJsonString.error) {
    throw new Error(
      ts.formatDiagnostic(configJsonString.error, ts.createCompilerHost({}))
    )
  }

  const configObj = ts.parseJsonConfigFileContent(
    configJsonString.config,
    ts.sys,
    path.dirname(configFilePath)
  )

  return {
    ...configObj.options,
    configDirPath: path.dirname(configFilePath),
    configFilePath,
  }
}

export function updateTSConfig(
  configFilePath: string,
  newConfig: {
    compilerOptions?: ts.CompilerOptions
    include?: string[]
  } = {},

  force?: true
) {
  if (force && !fs.existsSync(configFilePath)) {
    fs.writeFileSync(configFilePath, '{}', 'utf-8')
  }

  const configFileContent = fs.readFileSync(configFilePath, 'utf-8')
  const configObj = ts.parseConfigFileTextToJson(
    configFilePath,
    configFileContent
  )

  if (configObj.error) {
    throw new Error(
      ts.formatDiagnostic(configObj.error, ts.createCompilerHost({}))
    )
  }

  const updatedConfig = {
    ...configObj.config,

    compilerOptions: {
      ...configObj.config.compilerOptions,
      ...newConfig.compilerOptions,
    },

    include: [
      ...(configObj.config.include ?? []),
      ...(newConfig.include ?? []),
    ],
  }

  if (updatedConfig.include?.length) {
    const basePath = path.resolve(
      path.dirname(configFilePath),
      updatedConfig.compilerOptions.baseUrl ?? ''
    )

    const fullIncludePaths = updatedConfig.include.map((includePath: string) =>
      path.resolve(basePath, includePath)
    )

    updatedConfig.include = [...new Set<string>(fullIncludePaths)]
      .map((includePath) => path.relative(basePath, includePath))
      .filter(Boolean)
  }

  if (updatedConfig.include?.length === 0) {
    delete updatedConfig.include
  }

  const updatedConfigString = JSON.stringify(updatedConfig, null, 2)
  fs.writeFileSync(configFilePath, updatedConfigString, 'utf-8')
}
