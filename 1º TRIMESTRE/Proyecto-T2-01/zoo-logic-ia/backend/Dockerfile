# ---------- Etapa de compilación ----------
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ZooLogic.Api/ZooLogic.Api.csproj ZooLogic.Api/
RUN dotnet restore ZooLogic.Api/ZooLogic.Api.csproj
COPY ZooLogic.Api/ ZooLogic.Api/
RUN dotnet publish ZooLogic.Api/ZooLogic.Api.csproj -c Release -o /app/publish --no-restore

# ---------- Etapa de ejecución ----------
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
ENTRYPOINT ["dotnet", "ZooLogic.Api.dll"]
