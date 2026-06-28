import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {SearchSelectOption} from '../search-select/search-select.component';

@Component({
  selector: 'app-token-picker',
  templateUrl: './token-picker.component.html',
  styleUrls: ['./token-picker.component.scss']
})
export class TokenPickerComponent implements OnInit, OnChanges, OnDestroy {
  @Input() label = '';
  @Input() placeholder = 'Type to search...';
  @Input() options: SearchSelectOption[] | null | undefined = [];
  @Input() selected: SearchSelectOption[] | null | undefined = [];
  @Output() selectedChange = new EventEmitter<SearchSelectOption[]>();

  public searchControl: FormControl = new FormControl('');
  public filteredOptions: SearchSelectOption[] = [];
  public isOpen = false;
  private destroyed = new Subject<void>();

  ngOnInit(): void {
    this.filteredOptions = this.getFilteredOptions('');
    this.searchControl.valueChanges.pipe(takeUntil(this.destroyed)).subscribe(value => {
      const text = String(value ?? '');
      this.filteredOptions = this.getFilteredOptions(text);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options'] || changes['selected']) {
      this.filteredOptions = this.getFilteredOptions(String(this.searchControl.value ?? ''));
    }
  }

  public add(option: SearchSelectOption): void {
    const selected = this.getSelected();
    if (selected.some(item => String(item.id) === String(option.id))) {
      return;
    }
    this.selected = [...selected, option];
    this.selectedChange.emit(this.selected);
    this.searchControl.setValue('', {emitEvent: false});
    this.filteredOptions = this.getFilteredOptions('');
    this.isOpen = false;
  }

  public remove(option: SearchSelectOption): void {
    this.selected = this.getSelected().filter(item => String(item.id) !== String(option.id));
    this.selectedChange.emit(this.selected);
  }

  public openDropdown(): void {
    this.isOpen = true;
  }

  public closeDropdown(): void {
    window.setTimeout(() => {
      this.isOpen = false;
    }, 150);
  }

  public hasSelected(option: SearchSelectOption): boolean {
    return this.getSelected().some(item => String(item.id) === String(option.id));
  }

  public trackById(_: number, option: SearchSelectOption): string | number | null {
    return option.id;
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  private getFilteredOptions(text: string): SearchSelectOption[] {
    const options = this.getOptions();
    const selected = this.getSelected();
    const filterValue = text.toLowerCase();
    return options.filter(option => {
      const isSelected = selected.some(item => String(item.id) === String(option.id));
      const matches = option.name.toLowerCase().includes(filterValue);
      return !isSelected && matches;
    });
  }

  private getOptions(): SearchSelectOption[] {
    return this.options ?? [];
  }

  private getSelected(): SearchSelectOption[] {
    return this.selected ?? [];
  }
}
