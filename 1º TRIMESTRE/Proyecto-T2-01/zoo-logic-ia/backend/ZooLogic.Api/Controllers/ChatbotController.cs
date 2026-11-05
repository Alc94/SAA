using System.Globalization;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ZooLogic.Api.Data;
using ZooLogic.Api.Dtos;
using ZooLogic.Api.Models;

namespace ZooLogic.Api.Controllers;

/// <summary>
/// Chatbot educativo para visitantes. Esta primera versión es un asistente basado en reglas
/// que responde con los datos de la tabla "species"; está pensado para sustituirse por un LLM.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ChatbotController(AppDbContext db) : ControllerBase
{
    private static readonly Dictionary<string, string> StatusLabels = new()
    {
        ["LC"] = "preocupación menor",
        ["NT"] = "casi amenazada",
        ["VU"] = "vulnerable",
        ["EN"] = "en peligro",
        ["CR"] = "en peligro crítico"
    };

    [HttpPost("ask")]
    public async Task<ActionResult<ChatResponse>> Ask(ChatRequest request)
    {
        var species = await db.Species.AsNoTracking().OrderBy(s => s.CommonName).ToListAsync();
        var question = Normalize(request.Question);
        var match = species.FirstOrDefault(s => question.Contains(Normalize(s.CommonName)));

        if (match is null)
        {
            var names = string.Join(", ", species.Select(s => s.CommonName));
            return Ok(new ChatResponse(
                $"Soy el asistente educativo de Zoo-Logic IA. Puedo contarte cómo viven, qué comen y en qué estado de conservación están nuestras especies: {names}.",
                null,
                species.Take(3).Select(s => $"¿Qué come el {s.CommonName.ToLowerInvariant()}?")));
        }

        var status = StatusLabels.GetValueOrDefault(match.ConservationStatus, match.ConservationStatus);
        var name = match.CommonName.ToLowerInvariant();

        string answer;
        if (Has(question, "come", "comen", "comer", "aliment", "dieta"))
            answer = $"{match.CommonName}: {match.Diet}.";
        else if (Has(question, "vive", "viven", "habitat", "donde"))
            answer = $"{match.CommonName}: su hábitat es {Lower(match.Habitat)}.";
        else if (Has(question, "peligro", "extin", "conserv", "amenaz"))
            answer = $"El {name} está catalogado como «{status}» ({match.ConservationStatus}) según la UICN. Los parques como este participan en programas de cría y conservación.";
        else if (Has(question, "cientific", "nombre", "latin"))
            answer = $"El nombre científico del {name} es {match.ScientificName}.";
        else
            answer = $"Curiosidad sobre el {name}: {match.EducationalFact}";

        return Ok(new ChatResponse(answer, match.CommonName, SuggestionsFor(match)));
    }

    private static IEnumerable<string> SuggestionsFor(Species s)
    {
        var name = s.CommonName.ToLowerInvariant();
        return new[]
        {
            $"¿Qué come el {name}?",
            $"¿Dónde vive el {name}?",
            $"¿Está en peligro de extinción el {name}?"
        };
    }

    private static bool Has(string text, params string[] keys) => keys.Any(k => text.Contains(k));

    private static string Lower(string text) =>
        text.Length == 0 ? text : char.ToLowerInvariant(text[0]) + text[1..];

    /// <summary>Pasa a minúsculas y elimina tildes para comparar texto de forma tolerante.</summary>
    private static string Normalize(string text)
    {
        var decomposed = text.ToLowerInvariant().Normalize(NormalizationForm.FormD);
        var sb = new StringBuilder(decomposed.Length);
        foreach (var c in decomposed)
            if (CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark)
                sb.Append(c);
        return sb.ToString().Normalize(NormalizationForm.FormC);
    }
}
