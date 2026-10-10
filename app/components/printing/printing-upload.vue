<template>
  <printing-section id="upload" step="01" title="File Ingestion & Optical Preflight" stage="Stage 1/5">
    <div
      class="rounded-card border-2 border-dashed p-6 text-center transition-colors duration-200 sm:p-10"
      :class="over ? 'border-accent bg-accent-soft' : 'border-line bg-ink/40'"
      @dragenter.prevent="over = true"
      @dragover.prevent="over = true"
      @dragleave.prevent="over = false"
      @drop.prevent="onDrop"
    >
      <span class="mx-auto grid h-12 w-12 place-items-center rounded-full bg-raised text-accent" aria-hidden="true">
        <Icon :name="checking ? 'lucide:loader-circle' : 'lucide:cloud-upload'" size="24" :class="checking && 'animate-spin motion-reduce:animate-none'" />
      </span>
      <p class="mt-4 font-display text-lg font-semibold text-paper">Drag high-resolution TIFF, PSD or PDF files here</p>
      <p class="mx-auto mt-1 max-w-xl text-sm text-mute">or browse your workstation. Supports 16-bit ProPhoto RGB and CMYK, TIFF up to {{ MAX_FILE_MB }} MB. Calibrated baseline: 300 native optical DPI.</p>
      <LazyVButton class="mt-5" variant="secondary" icon="lucide:folder-open" @click="open()">Select local file</LazyVButton>
      <p class="mt-3 text-[11px] text-mute">Demo build: your file is checked in this browser and isn’t uploaded anywhere.</p>
    </div>

    <p v-if="fileError" role="alert" class="mt-3 flex items-start gap-2 rounded-control border border-accent/40 bg-accent-soft p-3 text-sm text-accent">
      <Icon name="lucide:circle-alert" size="16" class="mt-0.5 shrink-0" aria-hidden="true" />{{ fileError }}
    </p>

    <Transition name="fade">
      <div v-if="file" class="mt-4 rounded-card border border-line bg-ink/40 p-4">
        <div class="flex flex-wrap items-start gap-4">
          <span class="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-control border border-line bg-raised">
            <img v-if="previewUrl" :src="previewUrl" alt="Thumbnail of your uploaded file" class="h-full w-full object-cover" />
            <Icon v-else name="lucide:file-image" size="28" class="text-mute" aria-hidden="true" />
          </span>
          <div class="min-w-0 flex-1 space-y-1">
            <p class="truncate font-mono text-sm font-semibold text-paper">{{ file.name }}</p>
            <p class="font-mono text-xs text-mute">
              {{ sizeText }}<template v-if="pixels"> · {{ pixels.w }} × {{ pixels.h }} px</template><template v-if="dpi"> · {{ dpi }} ppi at this size</template>
            </p>
            <p class="flex items-center gap-1.5 text-sm font-semibold" :class="tone">
              <Icon :name="preflight.state === 'pass' ? 'lucide:check-circle' : 'lucide:triangle-alert'" size="16" aria-hidden="true" />{{ preflight.title }}
            </p>
            <p class="text-xs text-mute">{{ preflight.detail }}</p>
            <p v-if="hash" class="break-all font-mono text-[10px] text-mute">SHA-256: {{ hash }}</p>
          </div>
          <div class="flex gap-2">
            <LazyVButton size="sm" variant="secondary" icon="lucide:replace" @click="open()">Replace</LazyVButton>
            <LazyVButton size="sm" variant="tertiary" icon="lucide:trash-2" @click="clearFile">Remove</LazyVButton>
          </div>
        </div>
      </div>
    </Transition>
  </printing-section>
</template>

<script lang="ts" setup>
import { FILE_ACCEPT, MAX_FILE_MB } from "~/data/printing";

const { file, previewUrl, pixels, dpi, hash, fileError, checking, preflight, setFile, clearFile } = usePrintConfig();

const over = ref(false);
const { open, onChange } = useFileDialog({ accept: FILE_ACCEPT.join(","), multiple: false, reset: true });
onChange((files) => files?.[0] && setFile(files[0]));

const onDrop = (e: DragEvent) => {
  over.value = false;
  const f = e.dataTransfer?.files?.[0];
  if (f) setFile(f);
};

const sizeText = computed(() => (file.value ? `${(file.value.size / 1e6).toFixed(1)} MB` : ""));
const tone = computed(() => (preflight.value.state === "pass" ? "text-success" : "text-yellow"));
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}
@media (prefers-reduced-motion: reduce) {
  .fade-enter-active,
  .fade-leave-active {
    transition: none;
  }
}
</style>
