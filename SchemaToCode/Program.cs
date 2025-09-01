using SchemaToCode;

var schemaDir = "schemas";
var modelsDir = "Models";
var apisDir = "MinimalApis";

Directory.CreateDirectory(modelsDir);
Directory.CreateDirectory(apisDir);

foreach (var schemaPath in Directory.GetFiles(schemaDir, "*.json"))
{
    var className = Path.GetFileNameWithoutExtension(schemaPath);

    // 1. Generate POCO class
    var pocoCode = await SchemaClassGenerator.GenerateCSharpClassAsync(schemaPath, className);
    File.WriteAllText(Path.Combine(modelsDir, className + ".cs"), pocoCode);
    System.Console.WriteLine($"Generated {className}.cs");

    //// 2. Generate Minimal API endpoint
    //var apiCode = await SchemaApiGenerator.GenerateMinimalApiAsync(schemaPath, className);
    //File.WriteAllText(Path.Combine(apisDir, className + "Api.cs"), apiCode);
    //System.Console.WriteLine($"Generated {className}Api.cs");
}