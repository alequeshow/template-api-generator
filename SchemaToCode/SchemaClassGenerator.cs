using NJsonSchema;
using NJsonSchema.CodeGeneration.CSharp;

namespace SchemaToCode;

internal class SchemaClassGenerator
{
    internal static async Task<string> GenerateCSharpClassAsync(string schemaPath, string className)
    {
        var schema = await JsonSchema.FromFileAsync(schemaPath);
        var settings = new CSharpGeneratorSettings
        {
            Namespace = "Models",
            ClassStyle = CSharpClassStyle.Poco
        };
        var generator = new CSharpGenerator(schema, settings);
        return generator.GenerateFile(className);
    }
}