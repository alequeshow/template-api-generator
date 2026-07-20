#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /repo
COPY ["src/Template.Api/Template.Api.csproj", "src/Template.Api/"]
COPY ["src/Template.Application/Template.Application.csproj", "src/Template.Application/"]
COPY ["src/Template.Contract/Template.Contract.csproj", "src/Template.Contract/"]
COPY ["src/Template.DatabaseFactory/Template.DatabaseFactory.csproj", "src/Template.DatabaseFactory/"]
COPY ["src/Template.Infrastructure/Template.Infrastructure.csproj", "src/Template.Infrastructure/"]
COPY ["src/Template.Model/Template.Model.csproj", "src/Template.Model/"]
COPY ["src/Template.Repository/Template.Repository.csproj", "src/Template.Repository/"]
COPY ["src/Template.Security/Template.Security.csproj", "src/Template.Security/"]
RUN dotnet restore "./src/Template.Api/Template.Api.csproj"
COPY . .
WORKDIR "/repo/src/Template.Api"
RUN dotnet build "./Template.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./Template.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Template.Api.dll"]