<template>
  <printing-section
    id="upload"
    step="01"
    :title="t('printing_ui.upload_title')"
    :stage="t('printing_ui.stage_of', { n: 1, total: 5 })"
  >
    <LazyVFileUpload
      ref="uploader"
      :title="t('inputs.drag_file_here')"
      :drop-title="t('printing_ui.drop_file')"
      :description="t('printing_ui.upload_description', { max: MAX_FILE_MB })"
      :hint="t('printing_ui.upload_hint')"
      :accept="FILE_ACCEPT"
      :max-size-mb="MAX_FILE_MB"
      :loading="checking"
      :error="fileError"
      @select="(files) => setFile(files[0]!)"
    />

    <Transition name="fade">
      <div
        v-if="file"
        class="mt-4 rounded-card border border-line bg-ink/40 p-4"
      >
        <div class="flex flex-wrap items-start gap-4">
          <span
            class="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-control border border-line bg-raised"
          >
            <img
              v-if="previewUrl"
              :src="previewUrl"
              :alt="t('printing_ui.thumbnail_alt')"
              class="h-full w-full object-cover"
            />
            <Icon
              v-else
              name="lucide:file-image"
              size="28"
              class="text-mute"
              aria-hidden="true"
            />
          </span>
          <div class="min-w-0 flex-1 space-y-1">
            <p class="truncate font-mono text-sm font-semibold text-paper">
              {{ file.name }}
            </p>
            <p class="meta">
              {{ sizeText
              }}<template v-if="pixels">
                · {{ pixels.w }} × {{ pixels.h }} px</template
              ><template v-if="dpi">
                · {{ t("printing_ui.ppi_at_size", { n: dpi }) }}</template
              >
            </p>
            <p
              class="flex items-center gap-1.5 text-sm font-semibold"
              :class="tone"
            >
              <Icon
                :name="
                  preflight.state === 'pass'
                    ? 'lucide:check-circle'
                    : 'lucide:triangle-alert'
                "
                size="16"
                aria-hidden="true"
              />{{ preflight.title }}
            </p>
            <p class="text-xs text-mute">{{ preflight.detail }}</p>
            <p v-if="hash" class="break-all font-mono text-2xs text-mute">
              SHA-256: {{ hash }}
            </p>
          </div>
          <div class="flex gap-2">
            <LazyVButton
              size="sm"
              variant="secondary"
              icon="lucide:replace"
              @click="uploader?.open()"
              >{{ t("btn.replace") }}</LazyVButton
            >

            <LazyVButton
              size="sm"
              variant="tertiary"
              icon="lucide:trash-2"
              @click="clearFile"
              >{{ t("btn.remove") }}</LazyVButton
            >
          </div>
        </div>
      </div>
    </Transition>
  </printing-section>
</template>

<script lang="ts" setup>
import { FILE_ACCEPT, MAX_FILE_MB } from "~/data/printing";

const { t } = useI18n();

const {
  file,
  previewUrl,
  pixels,
  dpi,
  hash,
  fileError,
  checking,
  preflight,
  setFile,
  clearFile,
} = usePrintConfig();

const uploader = ref<{ open: () => void }>();

const sizeText = computed(() =>
  file.value ? `${(file.value.size / 1e6).toFixed(1)} MB` : "",
);

const tone = computed(() =>
  preflight.value.state === "pass" ? "text-success" : "text-yellow",
);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
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