import { CodeBlock, ReadingSample } from '../../docs';

export function TypographyTypeScale() {
  return (
    <div
      class="
        border-t border-line [&>div]:py-6 [&>div]:border-b
        [&>div]:border-line [&_p]:mb-3
      "
    >
      <div>
        <span
          class="
            block font-mono text-[11px] leading-5 text-muted mb-3
          "
        >
          Heading 1 · 36 / 44
        </span>
        <p
          class="
            font-serif font-semibold tracking-[-0.02em] text-[36px]
            leading-[44px]
          "
        >
          A place for knowledge
        </p>
        <span class="text-[13px] leading-5 text-muted">Source Serif 4 · Semibold</span>
      </div>
      <div>
        <span
          class="
            block font-mono text-[11px] leading-5 text-muted mb-3
          "
        >
          Heading 2 · 28 / 36
        </span>
        <p
          class="
            font-serif font-semibold tracking-[-0.02em] text-[28px]
            leading-9
          "
        >
          Built for useful work
        </p>
        <span class="text-[13px] leading-5 text-muted">Source Serif 4 · Semibold</span>
      </div>
      <div>
        <span
          class="
            block font-mono text-[11px] leading-5 text-muted mb-3
          "
        >
          Heading 3 · 22 / 28
        </span>
        <p
          class="
            font-serif font-semibold tracking-[-0.02em] text-[22px]
            leading-7
          "
        >
          Every detail has a purpose
        </p>
        <span class="text-[13px] leading-5 text-muted">Source Serif 4 · Semibold</span>
      </div>
      <div>
        <span
          class="
            block font-mono text-[11px] leading-5 text-muted mb-3
          "
        >
          Body · 16 / 26
        </span>
        <p>Find information, make an edit, and keep moving.</p>
        <span class="text-[13px] leading-5 text-muted">Inter · Regular</span>
      </div>
      <div>
        <span
          class="
            block font-mono text-[11px] leading-5 text-muted mb-3
          "
        >
          Control · 14 / 20
        </span>
        <p class="text-[14px] font-medium">Save changes</p>
        <span class="text-[13px] leading-5 text-muted">Inter · Medium</span>
      </div>
    </div>
  );
}

export function TypographyVietnamese() {
  return (
    <ReadingSample lang="vi">
      <h3>Tri thức mở cho mọi người</h3>
      <p>
        Những công cụ nhỏ giúp người đóng góp tìm kiếm, biên tập và chia sẻ kiến thức. Mỗi thay đổi
        đều có thể làm Wikipedia tốt hơn.
      </p>
      <p class="leading-[2]">
        Ă Â Đ Ê Ô Ơ Ư · ă â đ ê ô ơ ư<br />Ắ Ằ Ẳ Ẵ Ặ · Ấ Ầ Ẩ Ẫ Ậ · Ứ Ừ Ử Ữ Ự
      </p>
    </ReadingSample>
  );
}

export function TypographyCode() {
  return (
    <CodeBlock
      code={`import { Button } from '@taxon-labs/fern/button';

<Button variant="outline">Save changes</Button>

// Vietnamese glyphs: Tri thức mở`}
    />
  );
}
