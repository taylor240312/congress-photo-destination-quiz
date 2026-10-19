<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Quiz content (questions, images, option leans) lives in src/data/questions.ts and ebook URLs in src/config/destinations.ts; UI never hardcodes them — so content can change without touching components.
- Uploaded ebook PDFs use Lovable Assets JSON pointers in destination configuration; allow their same-origin asset paths so previews and published sites open the same documents.
- AI analysis runs only in a server function (src/lib/analyze.functions.ts) with a validated enum output; ties fall back to the majority rule in src/lib/scoring.ts — keeps keys off the client and decisions auditable.
