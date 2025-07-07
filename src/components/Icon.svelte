<script lang="ts">
    import { Icons } from "../misc";

    
    interface Props {
        // TODO: Make an "unknown" icon
        name: string;
        width: string;
        height: string;
    }

    let { name, width, height }: Props = $props();

    const filename = `/src/lib/assets/icons/${name.toLowerCase()}.svg`;
    const html = Icons[filename].default.replace(
        "<svg",
        `<svg width="${width}" height="${height}"`
    );
</script>

{@html html}
