<script lang="ts">
    import { Icons } from "../misc"

    // TODO: Make an "unknown" icon
    export let name: string;
    export let width: string;
    export let height: string;

    const filename = `/src/lib/assets/icons/${name.toLowerCase()}.svg`
    const html = Icons[filename].replace("<svg", `<svg width="${width}" height="${height}"`);
</script>

{@html html}
